
const styles = theme => ({
    root: {
        display: 'block'
    },
    card: {
        minWidth: 275,
        maxWidth: '60%',
        padding: 50,
        margin: 'auto',
        marginTop: 30,
        marginBottom: 30
    },
    heading: {
        fontSize: '15px'
    },
    formControl: {
        display: 'flex',
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    button: {
        float: 'right',
        margin: '0px 15px'
    },
    input: {
        display: 'none',
    },
    grow: {
        flexGrow: 1,
    },
    networkView: {
        minHeight: '600px',
        border: '2px solid black'
    },
    buttonBar: {
        display:'block',
        paddingTop: '20px',
    }
});

export default styles;