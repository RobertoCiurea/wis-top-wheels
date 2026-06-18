import { CardProps } from "../types/types"


export const Card = ({order, Icon, title, text}:CardProps)=>{
    return(
    <div className="why-card">
            <div className="why-num">{order}</div>
                    <div className="why-icon">
                    <Icon.src color={Icon.color} size={Icon.size}/>
                    </div>
                    <div className="why-title">{title}</div>
                    <div className="why-text">{text}</div>
                </div>
    )
}