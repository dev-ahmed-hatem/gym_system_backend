import { useRouteError } from "react-router-dom";
const NotFound = () => {
  const error = useRouteError();
  console.error(error);
  return (
    <div id="error-page" style={{ direction: "ltr" }}>
      <h1>Sorry, an unexpected error has occurred.</h1>
      <h1>
        <i>{error.statusText || error.message}</i>
      </h1>
    </div>
  );
};

export default NotFound;
