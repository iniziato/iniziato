import {FC, ReactElement} from "react";
import {Navbar} from "./Navbar";
import {Footer} from "@/components/Layout/Footer";

export const Layout:FC<{children:ReactElement}> = ({ children }) => {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </>
    );
};
