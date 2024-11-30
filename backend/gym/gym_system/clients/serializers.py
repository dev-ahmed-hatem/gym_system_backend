from rest_framework import serializers
from .models import *
from subscriptions.models import SubscriptionPlan, Subscription, Invitation
from subscriptions.serializers import SubscriptionReadSerializer
from financials.models import FinancialItem, Transaction
from users.models import Employee
from users.serializers import UserSerializer
from django.conf import settings
from django.utils.timezone import now, datetime


class ClientReadSerializer(serializers.ModelSerializer):
    added_by = UserSerializer()
    url = serializers.HyperlinkedIdentityField(view_name='client-detail')
    qr_code = serializers.SerializerMethodField(read_only=True)
    barcode = serializers.SerializerMethodField(read_only=True)
    subscriptions = serializers.SerializerMethodField()
    date_created = serializers.SerializerMethodField(read_only=True)
    trainer = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Client
        fields = '__all__'

    def get_qr_code(self, obj):
        qr_code = self.context['request'].build_absolute_uri(f"{settings.MEDIA_URL}{obj.qr_code}")
        return qr_code

    def get_barcode(self, obj):
        barcode = self.context['request'].build_absolute_uri(f"{settings.MEDIA_URL}{obj.barcode}")
        return barcode

    def get_subscriptions(self, obj):
        from subscriptions.serializers import SubscriptionReadSerializer
        subscriptions = obj.subscriptions.all().order_by('-start_date')
        return SubscriptionReadSerializer(subscriptions, many=True,
                                          context={'request': self.context.get('request')}).data

    def get_date_created(self, obj):
        return f"{obj.created_at.astimezone(settings.CAIRO_TZ):%Y-%m-%d - %H:%M:%S}"

    def get_trainer(self, obj):
        subs = Subscription.get_active_subscriptions().filter(client=obj).order_by('start_date')
        if subs.exists() and subs.last().trainer:
            return subs.last().trainer.name
        return None


class ClientWriteSerializer(serializers.ModelSerializer):
    subscription_plan = serializers.CharField(write_only=True, required=False)
    start_date = serializers.CharField(write_only=True, required=False)
    qr_code = serializers.CharField(read_only=True)
    barcode = serializers.CharField(read_only=True)
    trainer = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Client
        fields = '__all__'

    def validate_phone2(self, value):
        if Client.objects.filter(phone2=value).exists():
            raise serializers.ValidationError(f"Phone number {value} already exists")
        return value

    def create(self, validated_data):
        subscription_plan = validated_data.pop('subscription_plan', None)
        trainer = validated_data.pop('trainer', None)
        start_date = validated_data.pop('start_date', None)
        client = super().create(validated_data)

        # if not client.qr_code:
        #     client.generate_qr_code()
        # if not client.barcode:
        #     client.generate_barcode()

        trainer = Employee.objects.get(pk=trainer) if trainer else None
        if subscription_plan:
            plan = SubscriptionPlan.objects.get(id=subscription_plan)
            if start_date:
                start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            else:
                start_date = now().astimezone(settings.CAIRO_TZ).date()

            client_sub = Subscription.objects.create(plan=plan,
                                                     client=client,
                                                     start_date=start_date,
                                                     trainer=trainer)

            client_sub.save()
            financial_item, _ = FinancialItem.objects.get_or_create(name="إيرادات اشتراكات", financial_type="incomes",
                                                                    system_related=True)
            transaction = Transaction.objects.create(category=financial_item,
                                                     date=now().astimezone(settings.CAIRO_TZ).date(),
                                                     amount=client_sub.plan.price
                                                     )

        user = self.context['request'].user
        client.added_by = user
        client.save()

        return client

    def update(self, instance, validated_data):
        photo = validated_data.get('photo', None)
        if photo and instance.photo:
            instance.photo.delete()

        return super().update(instance, validated_data)


class AttendanceReadSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='attendance-detail')
    subscription = SubscriptionReadSerializer(read_only=True)
    client = ClientReadSerializer(read_only=True)
    timestamp = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Attendance
        fields = '__all__'

    def get_timestamp(self, obj):
        return f"{obj.timestamp.astimezone(settings.CAIRO_TZ):%Y-%m-%d - %H:%M:%S}"


class AttendanceWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        # fields = '__all__'
        exclude = ["client"]

    def create(self, validated_data):
        guest_name = self.initial_data.get("guest_name")
        subscription = validated_data.get('subscription', None)
        if guest_name:
            attendance = Attendance.objects.create(**validated_data, guest=guest_name)
            inv_id = self.initial_data.get("invitation")
            if inv_id:
                invitation = Invitation.objects.get(id=inv_id)
                attendance.invitation_code = invitation.code
                invitation.is_used = True
                subscription.invitations_used += 1
                invitation.save()
                attendance.save()
        else:
            # validated_data.pop('client', None)
            client_id = self.initial_data.get('client')
            client = Client.objects.get(id=client_id)
            attendance = Attendance.objects.create(**validated_data, client=client)
            subscription.attendance_days += 1
        subscription.save()
        return attendance


class ClientMobileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = [
            "custom_pk", "id", "name", "national_id", "gander", "birth_date", "age", "phone", "phone2", "email",
            "address", "photo", "requested_photo", "created_at", "is_blocked", "weight", "height"
        ]


class ClientPasswordSerializer(serializers.ModelSerializer):
    current_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Client
        fields = ["current_password", "new_password", "confirm_password"]

    def validate_current_password(self, value):
        client = Client.objects.get(id=self.context.get('id'))
        if not client.check_password(value):
            raise serializers.ValidationError("Incorrect password")
        return value

    def validate(self, attrs):
        new_password = attrs.get('new_password')
        confirm_password = attrs.get('confirm_password')
        if new_password != confirm_password:
            raise serializers.ValidationError({"confirm_password": ["Password doesn't match"]})
        return attrs
