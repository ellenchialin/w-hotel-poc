export const truncateAddress = (address) => {
  if (!address) return 'No Account'
  const match = address.match(
    /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/
  )
  if (!match) return address
  return `${match[1]}…${match[2]}`
}

export const loopToGetJSONs = async (array) => {
  let dataArray = []
  for (let i = 0; i < array.length; i++) {
    try {
      const response = await fetch(
        `https://gateway.pinata.cloud/ipfs/${array[i]}`
      )

      const data = await response.json()
      dataArray.push(data)
    } catch (error) {
      console.error(`Fetch Token ${i} JSON fails`, error)
    }
  }
  return dataArray
}
