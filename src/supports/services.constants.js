const services = {
    carrier:'fake_carrier'
}

const status_label ={
    pending : 'pending',
    processing: 'processing',
    completed : 'completed',
    error: 'error'
}

const message = {
    messageNotfound : 'No se encontro el registro solicitado',
    messageErrorServer: 'Ocurrio un problema en el proceso' 
}

module.exports = {
    services,
    status_label,
    message
}