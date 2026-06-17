"use client"
import {useState, useRef} from 'react';



export const ContactForm = ()=>{
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [subject, setSubject] = useState('');
    const [subjectError, setSubjectError] = useState('');
    const [message, setMessage] = useState('');
    const [messageError, setMessageError] = useState('');
    const buttonRef = useRef<HTMLButtonElement>(null);

const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!name || !phone || !subject || !message){
        if(!name) setNameError('Numele este obligatoriu')
             else setNameError('');
        if(!phone) setPhoneError('Telefonul este obligatoriu')
             else setPhoneError('');
        if(!subject) setSubjectError('Subiectul este obligatoriu')
             else setSubjectError('');
        if(!message) setMessageError('Mesajul este obligatoriu') 
            else setMessageError('');
        return 
    }
    if(phone && !/^\+?\d{10,15}$/.test(phone)){
        setPhoneError('Număr de telefon invalid');
        return
    }

    // resetErrors();
    if(buttonRef.current){
        buttonRef.current.disabled = true;
        buttonRef.current.classList.add('btn-success');
        buttonRef.current.textContent = "Mesaj trimis!";
        setTimeout(() => {
            buttonRef.current!.textContent = "Trimite mesajul";
            buttonRef.current!.disabled = false;
            buttonRef.current!.classList.remove('btn-success');
        }, 3000);
    }
    resetState();
    console.log('Form submitted:', { name, phone, subject, message });
}

const resetState = ()=>{
    setName("")
    setNameError("")
    setPhone("")
    setPhoneError("")
    setSubject("")
    setSubjectError("")
    setMessage("")
    setMessageError("")

}

    return (
          <form className="contact-form reveal visible" onSubmit={onSubmit}>
                <h3 className="display d4" style={{marginBottom: 24}}>Trimite un mesaj</h3>
                <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Nume</label>
                    {nameError && <div className="form-error">{nameError}</div>}
                    <input type="text" className={`form-input ${nameError ? 'form-input-error' : ''}`} placeholder="Ion Popescu" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Telefon</label>
                    {phoneError && <div className="form-error">{phoneError}</div>}
                    <input type="tel" className={`form-input ${phoneError ? 'form-input-error' : ''}`} placeholder="+40 7XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                </div>
                <div className="form-group">
                <label className="form-label">Subiect</label>
                {subjectError && <div className="form-error">{subjectError}</div>}
                <select className={`form-input ${subjectError ? 'form-input-error' : ''}`} value={subject} onChange={(e) => setSubject(e.target.value)}>
                    <option value="">Alege un subiect...</option>
                    <option>Jante & Anvelope</option>
                    <option>Mașini de vânzare</option>
                    <option>Programare vulcanizare</option>
                    <option>Altceva</option>
                </select>
                </div>
                <div className="form-group">
                <label className="form-label">Mesaj</label>
                {messageError && <div className="form-error">{messageError}</div>}
                <textarea className={`form-input ${messageError ? 'form-input-error' : ''}`} rows={4} placeholder="Descrie ce cauți, ce dimensiune de jante ai, când vrei să te programezi..." value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                </div>
                <div style={{display:'flex', gap:'12px', flexWrap:'wrap'}}>
                <button ref={buttonRef} type='submit' className="btn btn-gold" style={{flex:'1', justifyContent:'center'}}>Trimite mesajul</button>
                <a href="https://wa.me/40700000000" className="btn btn-ghost" style={{flex:'1', justifyContent:'center'}}>💬 WhatsApp direct</a>
                </div>
            </form>
    )
}