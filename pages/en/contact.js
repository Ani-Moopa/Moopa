import { NewNavbar } from "@/components/shared/NavBar";
import Footer from "@/components/shared/footer";

const Contact = () => {
  return (
    <>
      <NewNavbar withNav={true} scrollP={5} shrink={true} />
      <div className=" flex h-screen w-screen flex-col items-center justify-center font-karla  font-bold">
        <h1>Contact Us</h1>
        <p>If you have any questions or comments, please email us at:</p>
        <p>
          <a href="mailto:contact@moopa.live?subject=[Moopa]%20-%20Your%20Subject">
            contact@moopa.live
          </a>
        </p>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
