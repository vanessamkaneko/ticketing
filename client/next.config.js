module.exports = {
  webpack: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};

/* -> esse arquivo de config é p/ garantir que o next.js irá detectar mudanças realizadas nos arquivos e atualizar simultaneamente no pod
qndo estiver rodando num docker container (pois sem essa config, as vezes o next.js atualiza o arquivo c/ as mudanças e as vezes não...)

-> caso necessário, listar todos os pods que estão rodando (kubectl get pods), apagar o pod do client p/ que outro seja criado
automaticamente com esse config file dentro (kubectl delete pod <nomeDoClientPod>)

*/