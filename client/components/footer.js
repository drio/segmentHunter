export default function Footer() {
  return (
    <>
      <footer></footer>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'UA-2124421-14');
        `
        }}
      />
    </>
  );
}
