import React from "react";
import { SupportContainer, SupportCard, SupportInfo, Container } from "./styles";
import { Mail, Smartphone } from "lucide-react";

const Suporte = () => {
    return (
        <Container>
            <div style={{margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <h1>Suporte</h1>
            </div>
            <p style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 2rem', color: '#334155' }}>
                Precisa de ajuda? Nossa equipe de suporte está pronta para te atender!
                Entre em contato pelo <strong>e-mail</strong> ou <strong>WhatsApp</strong> e responderemos o mais rápido possível.
                Atendimento disponível em horário comercial de segunda a sexta.
            </p>
            <SupportContainer>
                <SupportCard>
                    <Mail size={32} />
                    <SupportInfo>
                        <h3 style={{ marginBottom: '8px' }}>Email</h3>
                        <a href="mailto:help@biazinsistemas.com">help@biazinsistemas.com</a>
                    </SupportInfo>
                </SupportCard>
          <SupportCard>
                    <Smartphone size={32} />
                    <SupportInfo style={{ display: 'flex' }}>
                        <h3 style={{ marginBottom: '8px' }}>WhatsApp</h3>
                        <div style={{ display: 'flex' }}>
                            <a style={{ marginBottom: '8px', marginRight: '8px' }}
                                href="https://wa.me/5544991179564"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                (44) 99117-9564
                            </a>
                            <a
                                href="https://wa.me/5517981352391"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                (17) 98135-2391
                            </a>
                        </div>
                    </SupportInfo>
                </SupportCard>
            </SupportContainer>
        </Container>
    );
};

export default Suporte;
