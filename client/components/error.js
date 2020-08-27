import Layout from "../components/layout";

const Error = ({ msg }) => {
  return (
    <Layout>
      <div className="box center">
        <article className="media">
          <div className="media-left">
            <figure className="image">
              <img
                src="404/dog-bike.jpg"
                alt="Image"
                style={{ width: "400px" }}
              />
            </figure>
          </div>
          <div className="media-content">
            <div className="content">
              <h1 className="title is-4"> Sorry, something went wrong. </h1>
              <h1 className="title is-5"> {msg} </h1>
            </div>
            <nav className="level is-mobile">
              <div className="level-left">
                <a className="level-item" aria-label="reply">
                  <span className="icon is-small">
                    <i className="fas fa-reply" aria-hidden="true"></i>
                  </span>
                </a>
                <a className="level-item" aria-label="retweet">
                  <span className="icon is-small">
                    <i className="fas fa-retweet" aria-hidden="true"></i>
                  </span>
                </a>
                <a className="level-item" aria-label="like">
                  <span className="icon is-small">
                    <i className="fas fa-heart" aria-hidden="true"></i>
                  </span>
                </a>
              </div>
            </nav>
          </div>
        </article>
      </div>
    </Layout>
  );
};

export default Error;
