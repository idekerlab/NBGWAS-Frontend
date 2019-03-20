// JSON structured collection of strings, links, and default values to be used throughout the app

const data = {
    title: 'Network Assisted Genomic Analysis',
    subheader: 'The network-boosted GWAS package re-prioritizes significant single nucleotide polymorphisms ' + 
        '(SNPs) to genes using network diffusion methods including random walk and heat diffusion.',
    version: '0.1.4',
    url: {
        sample_file: '/nagadata/schizophrenia.txt',
        sample_results: '/nagadata/example_output/example_schizophrenia_output.json',
        github: 'https://github.com/shfong/naga',
        swagger: '/rest/v1',
        data: '/nagadata',
        endpoint: "/rest/v1/snp_analyzer",
        ndex_query: 'http://www.ndexbio.org/v2/search/network/{networkid}/interconnectquery?save=false',
        // publication: "/", // ADD link to publication to generate a link in the app
    },
    defaults: {
        ndex: '',
        snp_level_summary: null,
        protein_coding: 'hg18',
        alpha: '',
        window: 10000
    },
    // Add protein coding files here.
    protein_codings: [{
        name: "hg18",
        path: "hg18",
        description: ""
    },
    {
        name: "hg19",
        path: "hg19",
        description: ""
    }],
    tooltips: {
        run_button_disabled: "'Network UUID in NDEx' field and 'UPLOAD GWAS SUMMARY STATISTICS' must be set to run NAGA processing",
        run_button_enabled: "Runs NAGA processing"
    },
    text: {
        snp_level_summary: 'Upload GWAS Summary Statistics',
        ndex: 'Network UUID in NDEx',
        alpha: 'Restart Probability (Leave blank to auto-generate)',
        window: 'Window Size',
        protein_coding: 'Genome for Protein Coding Region',
        run: 'Run',
        view_previous: 'View previous result by task ID',
    },
    help: {
        snp_level_summary: 'Comma delimited file  that includes a header line with columns that have the following names: chromosome, basepair, pvalue',
        alpha: 'Sets propagation constant alpha with allowed values between 0 and 1, representing the restart ' +
            'probability of walking to network neighbors as opposed to reseting to the original distribution. Larger ' +
            'values increases the likelihood of starting with the original distribution again. ',
        window: 'Window search size in base pairs used in snp search',
        protein_coding: 'Sets which protein coding table to use data relatedto NCBI human genome build hg18 or hg19',
    },
    sample_ndex: 'f93f402c-86d4-11e7-a10d-0ac135e8bacf',
    topN: 25,
    columns: {
        negativelog: 'Gene Input Heat',
        finalheat: 'Final Heat'
    },
    
    
}

export default data;