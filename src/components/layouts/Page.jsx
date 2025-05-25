import Menu from "./Menu";
 
 
 export default function Page(props){
    
     return(
         <>
             <Menu/>
             {
                 props.children
             }
         </>
     )
 }