const data = {
    title: 'NBGWAS Service',
    subheader: 'The network-boosed GWAS package re-prioritizes significant single nucleotide polymorphisms (SNPs) to genes using network diffusion methods including random walk and heat diffusion.',
    github: 'https://github.com/shfong/nbgwas',
    swagger: '/rest/v1',
    snp_level_summary_text: 'SNP Level Summary',
    snp_level_summary_help: 'Comma delimited file with format of (chromosome, basepair, p_value)',
    ndex_text: 'Network UUID',
    ndex_help: 'NDEx (http://www.ndexbio.org) UUID of network to load. For example, to use the Parsimonious Composite Network (PCNet), one would use this: f93f402c-86d4-11e7-a10d-0ac135e8bacf',
    alpha_text: 'Alpha (Leave blank to auto-generate)',
    alpha_help: 'Sets propagation constant alpha with allowed values between 0 and 1, representing the probability of walking to network neighbors as opposed to reseting to the original distribution. Larger values induce more spread on the network. If unset, then optimal parameter is selected by linear model derived from (huang, cell systems 2018)',
    window_text: 'Window',
    window_help: 'Window search size in base pairs used in snp search',
    protein_coding_text: 'Protein Coding',
    protein_coding_help: 'Sets which protein coding table to use data relatedto NCBI human genome build hg18 or hg19',
    run_text: 'Run',
    form: {
        ndex: 'f93f402c-86d4-11e7-a10d-0ac135e8bacf',
        snp_level_summary: '',
        protein_coding: 'hg19',
        alpha: '',
        window: 10000
    }
}

export default data;