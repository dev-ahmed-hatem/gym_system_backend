const style = (error) => {
    return {
        control: (base, state) => ({
            ...base,
            borderColor: error ? "#ff0000" : "#000000",
            color: error ? "#ff0000" : base.color,
            "&:hover": {
                borderColor: error ? "#ff0000" : "#000000",
            },
            boxShadow: state.isFocused
                ? error
                    ? "0 0 0 1px #ff0000"
                    : "0 0 0 1px #000000"
                : base.boxShadow,
        }),
        placeholder: (base, state) => ({
            ...base,
            color: error ? "#ff0000" : base.color,
        }),
    };
};

export default style;
