import { Link } from "react-router-dom"
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu"

export default function Navbar() {
    return (
        <nav className="w-full border-b bg-background">
            <div className="container mx-auto flex items-center justify-between p-4">
                {/* Sol tarafta logo / site adı */}
                <Link to="/" className="text-xl font-bold">ShortierV3</Link>

                {/* Sağ tarafta menü */}
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link to="/login">Login</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link to="/profile">Profile</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </nav>
    )
}
