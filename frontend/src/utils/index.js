// trnsform the values of employee relationships to contain the id directly
export const transformValues = (defaultValue) => {
    if (defaultValue) {
        const transformed_values = { ...defaultValue };
        const nested_fields = [
            "gander",
            "emp_type",
            "nationality",
            "religion",
            "marital_status",
            "city",
            "district",
        ];

        nested_fields.forEach((field) => {
            if (transformed_values[field] && transformed_values[field].id) {
                transformed_values[field] = transformed_values[field].id;
            }
        });
        return transformed_values;
    }
};

// clalculate age from datepicker field
export const calculateAge = ({ birth, setAge }) => {
    const date = new Date(birth);
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();

    // Check if the birthday has occurred this year
    const monthDifference = today.getMonth() - date.getMonth();
    const dayDifference = today.getDate() - date.getDate();

    // Adjust age if the birthday has not occurred yet this year
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--;
    }

    if (setAge) setAge(age)
    else return age;
};
