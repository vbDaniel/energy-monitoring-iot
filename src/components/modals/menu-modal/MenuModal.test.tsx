import { render, screen, fireEvent } from "@testing-library/react"

import MenuModal from "./MenuModal"

describe("MenuModal Component", () => {
    const handleClose = jest.fn()
    const handleActionClick = jest.fn()
    const header = <div>Header Content</div>
    const children = <div>Children Content</div>
    const anchorEl = document.createElement("div")

    it("should render the header content", () => {
        render(
            <MenuModal
                open={true}
                handleClose={handleClose}
                anchorEl={anchorEl}
                header={header}
            >
                {children}
            </MenuModal>
        )
        expect(screen.getByText("Header Content")).toBeInTheDocument()
    })

    it("should render the children content", () => {
        render(
            <MenuModal
                open={true}
                handleClose={handleClose}
                anchorEl={anchorEl}
                header={header}
            >
                {children}
            </MenuModal>
        )
        expect(screen.getByText("Children Content")).toBeInTheDocument()
    })

    it("should call handleActionClick when menu item is clicked", () => {
        render(
            <MenuModal
                open={true}
                handleClose={handleClose}
                handleActionClick={handleActionClick}
                anchorEl={anchorEl}
                header={header}
            >
                {children}
            </MenuModal>
        )
        fireEvent.click(screen.getByText("Children Content"))
        expect(handleActionClick).toHaveBeenCalled()
    })

    it("should disable menu item when disabledMenuItem is true", () => {
        render(
            <MenuModal
                open={true}
                handleClose={handleClose}
                anchorEl={anchorEl}
                header={header}
                disabledMenuItem={true}
            >
                {children}
            </MenuModal>
        )
        expect(
            screen.getByText("Children Content").closest("li")
        ).toHaveAttribute("aria-disabled", "true")
    })
})
