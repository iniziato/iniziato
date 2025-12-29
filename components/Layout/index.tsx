import {FC, ReactElement, Suspense} from "react";
import {Navbar} from "./Navbar";
import Loading from "./loading";
import {Footer} from "@/components/Layout/Footer";

export const Layout:FC<{children:ReactElement}> = ({ children }) => {
    return (
        <>
            <Navbar />
            <Suspense fallback={<Loading />}>
                <main>{children}</main>
            </Suspense>
            <Footer />
        </>
    );
};
