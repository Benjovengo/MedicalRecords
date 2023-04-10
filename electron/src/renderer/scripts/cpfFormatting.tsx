/**
   * Formats an 11-digit number as ***.***.***-**
   * 
   * @param CPF the string containing an 11-digit number - digits only
   * @returns formatted CPF as ***.***.***-**
   */
const cpfFormatting = (CPF: String) => {
  let CPFNumber = Number(CPF)
  let formattedCPF = String(CPFNumber).substring(0, 11)
  // Add a period after the third and sixth digits
  formattedCPF = formattedCPF.replace(/(\d{3})(\d)/, "$1.$2");
  formattedCPF = formattedCPF.replace(/(\d{3})(\d)/, "$1.$2");
  // Add a dash before the last two digits
  formattedCPF = formattedCPF.replace(/(\d{2})$/, "-$1");
  
  return formattedCPF
}


export default cpfFormatting