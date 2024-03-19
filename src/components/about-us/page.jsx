import { Modal, Typography, Box } from "@mui/material";

import React from "react";

const AboutUs = ({ open, handleClose }) => {
  const style = {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    border: "1px solid rgba(0,0,0,0.7)",
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="absolute flex flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] bg-background-paper border border-black dark:border-opacity-70 shadow-lg rounded-md p-6 bg-stone-50">
        <span className="font-bold text-2xl text-blue-800">
          Como funciona a plataforma?
        </span>
        <span className="mt-2 text-justify">
          Com a nossa plataforma, você tem acesso em tempo real às atualizações
          dos empreendimentos da construtora. Além disso, você pode gerenciar de
          forma eficiente todos os seus clientes, contratos e o status de
          negociação de cada cliente. Tudo isso é apresentado de forma clara e
          intuitiva em um dashboard interativo, projetado para simplificar a sua
          rotina como corretor e potencializar o seu desempenho!
        </span>
        <button
          type="button"
          className="w-[220px] h-8 border-0 bg-blue-800 text-white font-semibold rounded shadow-md cursor-pointer hover:border-[1px] hover:border-blue-800 hover:text-blue-800 hover:bg-transparent transition-all duration-300 text-sm mt-4"
        >
          Quero me cadastrar agora!
        </button>
      </div>
    </Modal>
  );
};

export default AboutUs;
