import Layout from "../../components/layout";

const Contact = () => {
  return (
    <Layout className="">
      <div className=" flex h-screen w-screen flex-col items-center justify-center font-karla  font-bold">
        <h1>Contact Us</h1>
        <p>If you have any questions or comments, please email us at:</p>
        <p>
          <a href="mailto:contact@rawflyanime.com?subject=[Shizuru]%20-%20Your%20Subject">
            contact@rawflyanime.com
          </a>
        </p>
      </div>
    </Layout>
  );
};

export default Contact;
