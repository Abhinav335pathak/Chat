const  IsMobile=()=>{
    const [isMobile, setIsMobile] = useState(false);    
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []); 
}
  export default IsMobile;
