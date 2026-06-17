import "@/app/styles/whyus.css"
export const WhyUs = ()=>{
    return(
        <section className="section" style={{background:'var(--surface)', borderTop:'1px solid var(--border)'}}>
        <div className="container">
            <div style={{textAlign:'center'}} className="reveal visible">
            <div className="eyebrow" style={{justifyContent:'center'}}>De ce noi?</div>
            <h2 className="display d2" style={{marginBottom:'16px'}}>Ce ne diferențiază <span className="accent">de alții</span></h2>
            <p className="lead" style={{margin:'0 auto'}}>Alegem calitatea în locul cantității. Fiecare decizie este luată cu clientul în minte.</p>
            </div>
            <div className="why-grid reveal visible">
            {/* Card 1*/}
            <div className="why-card">
                <div className="why-num">01</div>
                <div className="why-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z"/></svg>
                </div>
                <div className="why-title">Inspecție riguroasă</div>
                <div className="why-text">Fiecare jantă și mașină este verificată manual de tehnicieni experimentați înainte de vânzare.</div>
            </div>
            {/* Card 2 */}
            <div className="why-card">
                <div className="why-num">02</div>
                <div className="why-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(99, 230, 190)" d="M320 48C306.7 48 296 58.7 296 72L296 84L294.2 84C257.6 84 228 113.7 228 150.2C228 183.6 252.9 211.8 286 215.9L347 223.5C352.1 224.1 356 228.5 356 233.7C356 239.4 351.4 243.9 345.8 243.9L272 244C256.5 244 244 256.5 244 272C244 287.5 256.5 300 272 300L296 300L296 312C296 325.3 306.7 336 320 336C333.3 336 344 325.3 344 312L344 300L345.8 300C382.4 300 412 270.3 412 233.8C412 200.4 387.1 172.2 354 168.1L293 160.5C287.9 159.9 284 155.5 284 150.3C284 144.6 288.6 140.1 294.2 140.1L360 140C375.5 140 388 127.5 388 112C388 96.5 375.5 84 360 84L344 84L344 72C344 58.7 333.3 48 320 48zM141.3 405.5L98.7 448L64 448C46.3 448 32 462.3 32 480L32 544C32 561.7 46.3 576 64 576L384.5 576C413.5 576 441.8 566.7 465.2 549.5L591.8 456.2C609.6 443.1 613.4 418.1 600.3 400.3C587.2 382.5 562.2 378.7 544.4 391.8L424.6 480L312 480C298.7 480 288 469.3 288 456C288 442.7 298.7 432 312 432L384 432C401.7 432 416 417.7 416 400C416 382.3 401.7 368 384 368L231.8 368C197.9 368 165.3 381.5 141.3 405.5z"/></svg>
                </div>
                <div className="why-title">Prețuri transparente</div>
                <div className="why-text">Niciun cost ascuns. Prețul pe care îl vezi este prețul pe care îl plătești. Negocieri oneste.</div>
            </div>
            {/* Card 3 */}
            <div className="why-card">
                <div className="why-num">03</div>
                <div className="why-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 212, 59)" d="M434.8 54.1C446.7 62.7 451.1 78.3 445.7 91.9L367.3 288L512 288C525.5 288 537.5 296.4 542.1 309.1C546.7 321.8 542.8 336 532.5 344.6L244.5 584.6C233.2 594 217.1 594.5 205.2 585.9C193.3 577.3 188.9 561.7 194.3 548.1L272.7 352L128 352C114.5 352 102.5 343.6 97.9 330.9C93.3 318.2 97.2 304 107.5 295.4L395.5 55.4C406.8 46 422.9 45.5 434.8 54.1z"/></svg>
                </div>
                <div className="why-title">Răspuns rapid</div>
                <div className="why-text">Răspundem la WhatsApp și telefon în sub 30 de minute în zilele lucrătoare.</div>
            </div>
            {/* Card 4 */}
            <div className="why-card">
                <div className="why-num">04</div>
                <div className="why-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(116, 192, 252)" d="M320 64C324.6 64 329.2 65 333.4 66.9L521.8 146.8C543.8 156.1 560.2 177.8 560.1 204C559.6 303.2 518.8 484.7 346.5 567.2C329.8 575.2 310.4 575.2 293.7 567.2C121.3 484.7 80.6 303.2 80.1 204C80 177.8 96.4 156.1 118.4 146.8L306.7 66.9C310.9 65 315.4 64 320 64zM320 130.8L320 508.9C458 442.1 495.1 294.1 496 205.5L320 130.9L320 130.9z"/></svg>
                </div>
                <div className="why-title">Garanție post-vânzare</div>
                <div className="why-text">Ofertăm suport după cumpărare și garanție pe tot ce vindem. Nu dispărem după tranzacție.</div>
            </div>
            {/* Card 5 */}
            <div className="why-card">
                <div className="why-num">05</div>
                <div className="why-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(226, 130, 224)" d="M385.5 132.8C393.1 119.9 406.9 112 421.8 112L424 112C446.1 112 464 129.9 464 152C464 174.1 446.1 192 424 192L350.7 192L385.5 132.8zM254.5 132.8L289.3 192L216 192C193.9 192 176 174.1 176 152C176 129.9 193.9 112 216 112L218.2 112C233.1 112 247 119.9 254.5 132.8zM344.1 108.5L320 149.5L295.9 108.5C279.7 80.9 250.1 64 218.2 64L216 64C167.4 64 128 103.4 128 152C128 166.4 131.5 180 137.6 192L96 192C78.3 192 64 206.3 64 224L64 256C64 273.7 78.3 288 96 288L544 288C561.7 288 576 273.7 576 256L576 224C576 206.3 561.7 192 544 192L502.4 192C508.5 180 512 166.4 512 152C512 103.4 472.6 64 424 64L421.8 64C389.9 64 360.3 80.9 344.1 108.4zM544 336L344 336L344 544L480 544C515.3 544 544 515.3 544 480L544 336zM296 336L96 336L96 480C96 515.3 124.7 544 160 544L296 544L296 336z"/></svg>
                </div>
                <div className="why-title">Concursuri săptămânale</div>
                <div className="why-text">Participi și poți câștiga vouchere sau reduceri la jante și închirieri</div>
            </div>
            {/* Card 6 */}
            <div className="why-card">
                <div className="why-num">06</div>
                <div className="why-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 212, 59)" d="M420.9 448C428.2 425.7 442.8 405.5 459.3 388.1C492 353.7 512 307.2 512 256C512 150 426 64 320 64C214 64 128 150 128 256C128 307.2 148 353.7 180.7 388.1C197.2 405.5 211.9 425.7 219.1 448L420.8 448zM416 496L224 496L224 512C224 556.2 259.8 592 304 592L336 592C380.2 592 416 556.2 416 512L416 496zM312 176C272.2 176 240 208.2 240 248C240 261.3 229.3 272 216 272C202.7 272 192 261.3 192 248C192 181.7 245.7 128 312 128C325.3 128 336 138.7 336 152C336 165.3 325.3 176 312 176z"/></svg>
                </div>
                <div className="why-title">Consiliere personalizată</div>
                <div className="why-text">Te ajutăm să alegi jantele ideale pentru mașina și stilul tău; recomandări practice și verificări tehnice înainte de livrare.</div>
            </div>
            </div>
        </div>
        </section>
    )
}