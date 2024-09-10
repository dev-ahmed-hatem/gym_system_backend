const api_base_url = import.meta.env.VITE_API_BASE_URL;

const endpoints = {
    // authentication
    token_obtain: `${api_base_url}token/`,
    token_refresh: `${api_base_url}token/refresh/`,
    token_verify: `${api_base_url}token/verify/`,
    user_permissions: `${api_base_url}api/users/get_user_permissions/?`,
    set_permissions: `${api_base_url}api/users/set_user_permissions/?`,
    models_permissions: `${api_base_url}api/users/get_models_permissions/`,
    authenticated_user: `${api_base_url}api/get_authenticated_user/`,

    // gym-data routing
    gym_data: `${api_base_url}api/gym-data/gym-data/`,
    link_list: `${api_base_url}api/gym-data/link/`,

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
    subscription_plan_list: `${api_base_url}api/subscriptions/subscription-plan/?`,
    subscription_list: `${api_base_url}api/subscriptions/subscription/?`,
    subscription_base: `${api_base_url}api/subscriptions/subscription/`,

    // financials routing
    financial_item_list: `${api_base_url}api/financials/financial-item/?`,
    transaction_list: `${api_base_url}api/financials/transaction/?`,
    salary_list: `${api_base_url}api/financials/salary/?`,
    advance_list: `${api_base_url}api/financials/advance/?`,
    advance_payment_list: `${api_base_url}api/financials/advance-payment/?`,
    employee_advance_info: `${api_base_url}api/financials/employee-advance-info?`,

    // clients routing
    client_list: `${api_base_url}api/clients/client/?`,
    scanner_code: `${api_base_url}api/clients/scanner-code/?`,
    attendance: `${api_base_url}api/clients/attendance/?`,

    // shop routing
    product_category_list: `${api_base_url}api/shop/product-category/?`,
    product_list: `${api_base_url}api/shop/product/?`,
    add_stock: `${api_base_url}api/shop/add-stock/?`,
    sale_list: `${api_base_url}api/shop/sale/?`,
    offer_list: `${api_base_url}api/shop/offer/?`,

    // reports routing
    statistics: `${api_base_url}api/reports/statistics/`,
    daily_reports: `${api_base_url}api/reports/daily-reports/?`,
    duration_reports: `${api_base_url}api/reports/duration-reports/?`,
    birthdays: `${api_base_url}api/reports/birthdays/?`,
};

export default endpoints;
