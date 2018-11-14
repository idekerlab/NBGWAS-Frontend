const styles = theme => ({
    card: {
        minWidth: 275,
        maxWidth: '60%',
        padding: 50,
        margin: 'auto',
        marginTop: 30,
        marginBottom: 30,
    },
    formControl: {
        display: 'flex',
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    textField: {

    },
    button: {
        margin: 'auto',
        marginRight: 30
    },
    input: {
        display: 'none',
    },
    grow: {
        flexGrow: 1,
    },
});

export default styles;