import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#6F4E37]" />
          <span>Aviso Legal & Protección de Datos</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] font-display">
          Políticas de Privacidad y Tratamiento de Datos
        </h1>
        <p className="text-xs text-slate-500">
          Última actualización: Septiembre de 2026 • Hacienda Monteverde S.A.S.
        </p>
      </div>

      <div className="p-8 sm:p-12 rounded-[32px] bg-white border border-slate-100 shadow-sm space-y-8 text-slate-700 text-xs leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2 font-display">
            <Lock className="w-4 h-4 text-[#6F4E37]" />
            1. Compromiso de Privacidad y Marco Legal
          </h2>
          <p>
            Hacienda Monteverde S.A.S., identificada con NIT 901.452.883-4, en cumplimiento de la Ley Estatutaria 1581 de 2012, el Decreto Reglamentario 1377 de 2013 y demás normas que modifiquen o complementen el régimen de Protección de Datos Personales en Colombia, informa a sus usuarios, clientes y visitantes la política aplicable para la recolección, almacenamiento y uso de información personal en este portal.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2 font-display">
            <Eye className="w-4 h-4 text-[#6F4E37]" />
            2. Finalidad del Tratamiento de los Datos Recolectados
          </h2>
          <p>Los datos solicitados a través de nuestros formularios tienen las siguientes finalidades exclusivas:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>
              <strong>Sistema de Cotizaciones Mayoristas:</strong> Generar propuestas comerciales de café y miel, cálculo de fletes y contacto directo con el representante comercial.
            </li>
            <li>
              <strong>Sistema de Agendamiento Pro:</strong> Registro de asistentes a eventos y talleres de temporada, expedición del pase digital con código QR y confirmación de pagos.
            </li>
            <li>
              <strong>Tienda & Marketplace:</strong> Procesamiento de pedidos por unidad al detal, despacho logístico y emisión de factura legal.
            </li>
            <li>
              <strong>Atención al Cliente:</strong> Dar respuesta oportuna a peticiones, quejas, reclamos o sugerencias presentadas en nuestro formulario de contacto.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2 font-display">
            <FileText className="w-4 h-4 text-[#6F4E37]" />
            3. Seguridad en Pagos y Pasarelas
          </h2>
          <p>
            Hacienda Monteverde no almacena de manera directa números de tarjetas de crédito o códigos de seguridad en sus servidores. Todas las transacciones procesadas mediante PSE, tarjetas débito/crédito y billeteras digitales como Nequi o Daviplata operan bajo estándares de cifrado TLS/SSL de 256 bits mediante pasarelas de pago certificadas con PCI-DSS.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2 font-display">
            <CheckCircle2 className="w-4 h-4 text-[#6F4E37]" />
            4. Derechos de los Titulares (Derechos ARCO)
          </h2>
          <p>
            Como titular de sus datos personales, usted tiene derecho a conocer, actualizar, rectificar o solicitar la supresión de sus datos de nuestras bases de datos en cualquier momento. Para ejercer estos derechos puede remitir una comunicación escrita al correo electrónico: <strong>privacidad@fincamonteverde.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};
