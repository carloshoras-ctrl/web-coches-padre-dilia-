import React from 'react';
import './styles.css'; // Asegúrate de importar el CSS
import whatsappIcon from '../../../assets/icons/whatsapp-icon2.png'
export default function WhatsAppButton() {
    const phoneNumber = "34600123456";
    const message = encodeURIComponent("Hola, quiero información sobre un coche");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <a
            href={whatsappUrl}
            className="whatsapp-float"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp"
        >
            <img src={whatsappIcon} alt="Icono de WhatsApp" >

            </img>
        </a>
    );
}