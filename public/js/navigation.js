window.onload = () => {
    const navIconMenu = document.getElementById("arrow-menu");
    
    if (navIconMenu) {
        navIconMenu.onclick = () => {
            let navMenu = document.getElementById("menu");
            
            if (navMenu.classList.contains("open") && navIconMenu.classList.contains("open")) {
                navIconMenu.classList.remove("fa-angle-up");
                navIconMenu.classList.add("fa-angle-down")
                navIconMenu.classList.remove("open");

                navMenu.classList.remove("open");  
            } else {
                navIconMenu.classList.remove("fa-angle-down")
                navIconMenu.classList.add("fa-angle-up");
                navIconMenu.classList.add("open");
                
                navMenu.classList.add("open");  
            }
        };
    }
}