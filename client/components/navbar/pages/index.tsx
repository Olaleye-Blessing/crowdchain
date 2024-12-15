import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { categories } from "@/utils/categories";

const _categories = ["All", ...categories];

const Pages = () => {
  return (
    <>
      <NavigationMenu className="flex-none max-w-none [&>div]:w-full md:[&>div]:w-auto">
        <NavigationMenuList className="flex-col px-4 [&>*]:my-1 md:[&>*]:my-0 md:px-0 md:flex-row">
          <NavigationMenuItem className="w-full">
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle({
                  className: "!w-full !justify-start md:hidden",
                })}
              >
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem className="w-full">
            <Link href="/campaigns" legacyBehavior passHref>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle({
                  className: "!w-full !justify-start md:hidden",
                })}
              >
                Campaigns
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem className="w-full">
            <Link href="/create" legacyBehavior passHref>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle({
                  className: "!w-full !justify-start md:hidden",
                })}
              >
                Create Campaign
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem className="hidden md:inline-flex">
            <NavigationMenuTrigger>Campaigns</NavigationMenuTrigger>
            <NavigationMenuContent className="px-3 py-2">
              <header>
                <h3 className="text-muted-foreground text-base">By Category</h3>
              </header>
              <ul className="grid grid-cols-3 gap-2 w-[30rem] pb-1">
                {_categories.map((category) => {
                  let path = category.replaceAll(" ", "_").toLowerCase();
                  const href = `/campaigns${path === "all" ? "" : `?category=${path}`}`;

                  return (
                    <li key={path}>
                      <Link
                        href={href}
                        className="w-full text-sm hover:text-primary"
                      >
                        {category}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem className="w-full">
            <Link href="/faucets" legacyBehavior passHref>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle({
                  className: "!w-full !justify-start",
                })}
              >
                Faucets
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};

export default Pages;
