import { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";

import './About.css'



const About = () => {
  // Hooks
  const [aboutMe, setAboutMe] = useState('')


  useEffect(() => {
    console.log(aboutMe)
  }, [aboutMe]);


  const clickApp = (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (aboutMe !== 'app') {
      setAboutMe('app')
    } else {
      setAboutMe('')
    }
  }


  const clickDev = (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (aboutMe !== 'benjovengo') {
      setAboutMe('benjovengo')
    } else {
      setAboutMe('')
    }
  }

  return (
    <>
      <Container className='about__wrapper mt-5'>
        <Row>
          <Col className="text-center">
            <h5 className="about__link" onClick={(event: any) => clickApp(event)}>About the App</h5>
          </Col>
          <Col className="text-center">
            <h5 className="about__link" onClick={(event: any) => clickDev(event)}>About the Developer</h5>
          </Col>
        </Row>


        <Row>
          <Col>
            {/* {(aboutMe === 'benjovengo')? <>Benjovengo</> : <>App</>} */}
            {(aboutMe === 'benjovengo')? <>
              <Row className="about__text">
                <Col className="profile__picture"></Col>
                <Col>
                  <h5>About Me</h5>
                  <p>Hello, I am <b>Fábio Benjovengo</b>!!</p>
                  <p>As an experienced developer with a passion for coding that started at a young age, I bring a unique perspective to the world of programming. I've worked with computers since my parents' Intel 286, with only 1.024MB of RAM and 40MB of space in my hard drive, and have been fascinated by the endless possibilities that programming offers ever since.</p>
                  <p>As an assistant professor of the Electrical Engineering School of Puc Campinas, I have come to recognize that decentralized computing algorithms are the future of mankind. To that end, I have focused my efforts on programming the next generation of the web, which will usher in a new paradigm that will reshape the world. As a blockchain developer, I am excited to be at the forefront of this groundbreaking technology and look forward to contributing to its continued evolution.</p>
                  <p>Feel free to contact me at <b>fabio.benjovengo@gmail.com</b> and let's code our way to excellence!</p>
                </Col>
              </Row>
            </> : <>{(aboutMe === 'app')? <>
              <Row className="about__text">
                <Col>
                  <h5>About the App</h5>
                  <p>This app provides a secure and efficient solution for healthcare providers to manage and record patient medical procedures and vaccine data on the blockchain. As the world becomes more digital, the need for reliable and secure data management solutions in healthcare is paramount. With our app, healthcare providers can easily add and access patient data, while ensuring the privacy and security of that data.</p>
                  <p>The app was developed with the aid of healthcare professionals, who have come together to create a powerful and easy-to-use solution for medical data management. Our app is designed with the user in mind, providing a simple and intuitive interface that streamlines data entry and retrieval. We are committed to improving the efficiency and accuracy of medical data management, and believe that our app will play a key role in advancing the quality of patient care. Join us today in revolutionizing the healthcare industry with our blockchain-based medical data management app.</p>
                </Col>
                <Col className="gif__animation">
                </Col>
              </Row>
            </>: <></>}</>}
          </Col>
        </Row>
        <Row>
          <Col lg="12" className="mb-1 mt-4 text-center">
            <i>Developed by Fábio Benjovengo</i> < i className="ri-copyright-line"></i>
          </Col>
        </Row>
      </Container>
    </>
  )
}


export default About