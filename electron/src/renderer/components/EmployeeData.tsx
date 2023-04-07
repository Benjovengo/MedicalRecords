import { useEffect } from 'react';
import { Container, Row, Col } from "reactstrap";
import { ethers } from 'ethers'

/** Contract and Address */
import AuthorizedAccounts from '../../abis/AuthorizedAccounts.json' // contract ABI
import config from '../../config.json' // contracts addresses
import { ALCHEMY_API_KEY, PRIVATE_KEY, HARDHAT_ACCOUNT01_PRIVATE_KEY } from '../../../work/sensitive';

/** Stylesheet */
import './EmployeeData.css'


interface employeeProps {
  address: string;
}


const Employee: React.FunctionComponent<employeeProps> = ({ address }) => {
  // Get today's date
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate());
  
  // Setup provider and signer
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  const signer = new ethers.Wallet(HARDHAT_ACCOUNT01_PRIVATE_KEY, provider);
  // Javascript "version" of the smart contract
  const authorizedAccounts = new ethers.Contract(config[31337].authorizedAccounts.address, AuthorizedAccounts, signer)
  
  
  useEffect(() => {
    // Execute callback function
    connectEmployee(address)
  }, [address]);
  
  
  const connectEmployee = async (_address: string) => {
    //console.log('Address: ', _address)
    const person = await authorizedAccounts.getAuthorizedPerson(_address)
    let firstNameInput = (document.getElementById("employeeFirstName") as HTMLInputElement)
    firstNameInput.value = person.firstName
    let lastNameInput = (document.getElementById("employeeLastName") as HTMLInputElement)
    lastNameInput.value = person.lastName
    let employeeCPF = (document.getElementById("employeeCPF") as HTMLInputElement)
    employeeCPF.value = cpfFormatting(person.CPF)
    let authorizedCheckbox = (document.getElementById("authorizedCheckbox") as HTMLInputElement)
    authorizedCheckbox.checked = person.isAuthorized
    let authorization = 'This account is NOT authorized'
    if (person.isAuthorized) {
      authorization = 'This account is authorized!'
    }
    document.getElementById('isAuthorized')!.innerHTML = authorization
  }


  const cpfFormatting = (CPF: String) => {
    let CPFNumber = Number(CPF)
    let formattedCPF = String(CPFNumber)
    // Add a period after the third and sixth digits
    formattedCPF = formattedCPF.replace(/(\d{3})(\d)/, "$1.$2");
    formattedCPF = formattedCPF.replace(/(\d{3})(\d)/, "$1.$2");
    // Add a dash before the last two digits
    formattedCPF = formattedCPF.replace(/(\d{2})$/, "-$1");
    
    return formattedCPF
  }


  const formatEmployeeCPF = async (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Form data
    const employeeCPF = (document.getElementById("employeeCPF") as HTMLInputElement).value
    // Remove all non-numeric characters from the input value
    const employeeNumericCPF = employeeCPF.replace(/\D/g, '');
    // format CPF
    let CPFInput = (document.getElementById("employeeCPF") as HTMLInputElement)
    CPFInput.value = cpfFormatting(employeeNumericCPF)
  }
  

  return (
    <>
      <Container className='employee__container'>
        <Row className='employee__wrapper'>
          <Col>
            <Row className='employee__header'>
              <Col className='text-center'>
                Employee connected to <i>localhost</i>
              </Col>
            </Row>
            <Row>
              <Col xs={5}>
                <Row>
                  <Col>
                    <Row>
                      <Col>
                        <input type="text" id="employeeFirstName" name="employeeFirstName" required />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className='patient__label' htmlFor="employeeFirstName">First Name</label>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row className='mb-2'>
                  <Col>
                    <Row>
                      <Col>
                        <input type="text" id="employeeLastName" name="employeeLastName" required />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className='patient__label' htmlFor="employeeLastName">Last Name</label>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Row>
                <Col xs={4}>
                  <Row className='mb-2'>
                    <Col>
                      <Row>
                        <Col>
                          <input type="text" id="employeeCPF" name="employeeCPF" onChange={(event: any) => formatEmployeeCPF(event)} placeholder='000.000.000-00' required />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <label className='patient__label' htmlFor="employeeCPF">CPF Number</label>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <input className='checkbox_style' type="checkbox" id="authorizedCheckbox" name="authorizedCheckbox" defaultValue="true"/>
                  <label className='authorized__label' htmlFor="authorizedCheckbox">Is authorized?</label>
                </Col>
                <Col>
                  {/* <button onClick={(event: any) => updateEmployeeInfo(event)}>Add/Update</button> */}
                </Col>
              </Row>
            </Row>
            <Row className='employee__authorization'>
              <Col className='text-center'>
                <span id='isAuthorized'></span>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}


export default Employee