const getNameDay = async (url)=>{
   
    const response = await fetch(url);
    
    if(response.status !== 200){
        throw new Error('There is a problem, try again later')
    }
    
    const data = await response.json()
    
    return data;

}