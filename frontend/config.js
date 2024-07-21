const api_base_url = import.meta.env.VITE_API_BASE_URL;

const endpoints = {
    // users routing
    manager_list: `${api_base_url}api/users/users/?is_superuser=true`,
    employee_list: `${api_base_url}api/users/employee/?`,
    nationality_list: `${api_base_url}api/users/nationality/?`,
    marital_status_list: `${api_base_url}api/users/marital-status/?`,
    employee_type_list: `${api_base_url}api/users/employee-type/?`,
    city_list: `${api_base_url}api/users/city/?`,
    city_district_list: `${api_base_url}api/users/city-district/?`,
    moderator_list: `${api_base_url}api/users/moderator/?`,

    // subscriptions routing
    subscription_list: `${api_base_url}api/subscriptions/subscription-plan/?`,
    locker_list: `${api_base_url}api/subscriptions/locker-plan/?`,
    additional_plan_list: `${api_base_url}api/subscriptions/additional-plan/?`,

    // financials routing
    financial_item_list: `${api_base_url}api/financials/financial-item/?`,

    // clients routing
    client_list: `${api_base_url}api/clients/client/?`,

    // shop routing
    product_category_list: `${api_base_url}api/shop/product-category/?`,
    product_list: `${api_base_url}api/shop/product/?`,
};

export default endpoints;
