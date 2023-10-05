import { Tooltip as ChakraTooltip } from '@chakra-ui/react'

export function Tooltip({ children, label }) {
    return (
        <ChakraTooltip
            label={label}
            background="rgb(60, 64, 67)"
            color="white"
            padding="4px 8px"
            borderRadius="4px"
            fontSize="12px"
        >
            {children}
        </ChakraTooltip>
    )
}
