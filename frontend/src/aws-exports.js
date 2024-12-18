const awsmobile = {
  aws_project_region: process.env.REACT_APP_AUTH_REGION,
  aws_cognito_region: process.env.REACT_APP_AUTH_REGION,
  aws_user_pools_id: process.env.REACT_APP_AUTH_USER_POOL_ID,
  aws_user_pools_web_client_id:
    process.env.REACT_APP_AUTH_USER_POOL_WEB_CLIENT_ID,
};

console.log(awsmobile);

export default awsmobile;
