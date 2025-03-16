function randomArray(array,setarray) {
    const shuffleArray = (array) => {
        return array
          .map((item) => ({ ...item, sort: Math.random() })) // Add random sort key
          .sort((a, b) => a.sort - b.sort) // Sort based on the random key
          .map(({ sort, ...item }) => item); // Remove the sort key
      };
      setarray(shuffleArray(array))
}
export default randomArray
