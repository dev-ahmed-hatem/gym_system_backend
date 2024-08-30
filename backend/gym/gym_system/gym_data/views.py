from .serializers import *
from .models import *
from rest_framework.viewsets import ModelViewSet


class GymDataViewSet(ModelViewSet):
    serializer_class = GymDataSerializer
    queryset = GymData.objects.all()


class LinkViewSet(ModelViewSet):
    serializer_class = LinkSerializer
    queryset = Link.objects.all()