import Header from "../components/header";
import Footer from "../components/footer";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <div
        className="section"
        style={{
          width: "100hw",
          height: "100vh",
          margin: 0,
          padding: 0
        }}
      >
        {children}
      </div>
      <Footer />
    </>
  );
}
