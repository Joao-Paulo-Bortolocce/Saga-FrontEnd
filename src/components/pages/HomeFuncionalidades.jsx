import Page from "../layouts/Page";

export default function HomeFuncionalidades() {
    return (
        <>
            <Page />
            <main>
                <section style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <section className=" justify-evenly flex row" style={{ width: "75%" }}>
                        <div className="w-3/5"><input style={{ width: "100%" }} className="border-4 border-solid rounded-xl pl-4" placeholder="    Digite um filtro" type="text" id="filtroInput" /></div>
                        <div className="w-1/5 ">
                        </div>
                    </section>
                </section>
            </main>
        </>
    )
}