//import Link from "next/link";
//import styles from "./header.module.css";

export default function Header() {
  //const [session, loading] = useSession();

  return (
    <div>
      <div
        className="has-text-weight-medium is-size-7"
        style={{ position: "absolute", top: "5px", right: "10px" }}
      >
        Segment Hunter (v0.2.2)
      </div>
      <header className="header has-text-weight-medium is-size-7">
        <div style={{ backgroundColor: "white" }}>
          <div className="columns" style={{}}>
            <div
              className="column"
              style={{ padding: "15px", paddingLeft: "20px" }}
            >
              <ul
                style={{
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <li style={{}}> login</li>
                <li style={{ marginLeft: "4px" }}>
                  <figure class="image is-24x24">
                    <img
                      class="is-rounded"
                      src="https://dgalywyr863hv.cloudfront.net/pictures/athletes/736965/158947/1/medium.jpg"
                    />
                  </figure>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
