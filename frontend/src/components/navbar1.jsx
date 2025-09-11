import { Book, Menu, Moon, Sun, Sunset, Trees, Zap } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Link } from "react-router-dom";
import { useTheme } from "./theme-provider";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import {motion} from "framer-motion"

const Navbar1 = ({
  logo = {
    url: "/",
    title: "DigiPraman",
  },

  menu = [
    { title: "Home", url: "#home" },
    {
      title: "Features",
      url: "#features",
    },
    {
      title: "About Us",
      url: "#about",
    },
    // {
    //   title: "Pricing",
    //   url: "#",
    // },
    {
      title: "Contact Us",
      url: "#contact",
    },
  ],

  auth = {
    login: { title: "Login", url: "#" },
    signup: { title: "Sign up", url: "#" },
  },
}) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const isdark = theme === "dark";
  const toggleTheme = () => {
    if (isdark) {
      setTheme("light");
      return;
    }
    setTheme("dark");
  };

  const scrollToSection = (sectionId) => {
    console.log(`Scrolling to section: ${sectionId}`);
    // Add a small delay to ensure DOM is ready
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        console.log(`Found element with id ${sectionId}`, element);
        window.scrollTo({
          top: element.offsetTop - 80, // Offset for navbar height
          behavior: 'smooth'
        });
      } else {
        console.error(`Element with id ${sectionId} not found`);
      }
    }, 100);
  };

  // Using Link component with hash navigation doesn't work well with smooth scrolling
  // Use a regular anchor tag for hash links instead
  const NavigationLink = ({ url, title, className }) => {
    if (url.startsWith('#')) {
      return (
        <a 
          href={url}
          onClick={(e) => {
            e.preventDefault();
            handleMenuClick(url);
          }}
          className={className}
        >
          {title}
        </a>
      );
    }
    
    return (
      <Link to={url} className={className}>
        {title}
      </Link>
    );
  };

  const handleMenuClick = (url) => {
    if (url.startsWith('#')) {
      const sectionId = url.substring(1);
      scrollToSection(sectionId);
    } else {
      navigate(url);
    }
  };

  return (
    <section
      className={cn(
        "sticky top-0 w-full bg-background/80 backdrop-blur-md border-b z-50 supports-[backdrop-filter]:bg-background/60",
        //border at last
        "border-b-1"
      )}
    >
      <div className="max-w-7xl mx-auto ">
        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('home');
              }}
              className="flex items-center gap-2 flex-shrink-0"
            >
              <div
                className="text-3xl font-extrabold tracking-tight leading-none cursor-pointer"
              >
                <span className="text-green-500 dark:text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]">
                  Digi
                </span>
                <span className="text-gray-800 dark:text-gray-200">Praman</span>
              </div>
            </a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList className="gap-6">
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex items-center gap-3 cursor-pointer"
          onClick={toggleTheme}

          >
            <Button
              variant="ghost"
              size="icon"
              
              className={cn(
                "h-12 w-12 relative overflow-hidden cursor-pointer",
                "transition-all duration-300 ease-in-out hover:bg-accent"
              )}
            >
              <div className="relative flex items-center justify-center">
                <Sun
                  className={cn(
                    "h-6 w-6 absolute text-yellow-500 transition-all duration-500 ease-in-out",
                    isdark
                      ? "rotate-0 scale-100 opacity-100"
                      : "-rotate-90 scale-0 opacity-0"
                  )}
                />

                <Moon
                  className={cn(
                    "h-6 w-6 absolute text-blue-500 transition-all duration-500 ease-in-out",
                    isdark
                      ? "rotate-360 scale-0 opacity-0"
                      : "rotate-0 scale-100 opacity-100"
                  )}
                />
              </div>
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button
              asChild
              variant="outline"
              size="default"
              className="h-10 px-6 border-green-600 text-green-600 hover:bg-green-600 hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-white transition-colors text-lg"
            >
              <Link to={auth.login.url}>{auth.login.title}</Link>
            </Button>
            {/* <Button asChild size="sm">
              <Link to={auth.signup.url}>{auth.signup.title}</Link>
            </Button> */}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between h-14 px-4">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('home');
              }}
              className="flex items-center gap-2 flex-shrink-0"
            >
              <div
                className="text-xl sm:text-2xl font-bold tracking-tight cursor-pointer"
              >
                <span className="text-green-400 dark:text-green-300 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]">
                  Digi
                </span>
                <span className="text-gray-800 dark:text-gray-200">Praman</span>
              </div>
            </a>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className={cn(
                  "h-10 w-10 relative overflow-hidden",
                  "transition-all duration-300 ease-in-out hover:bg-accent"
                )}
              >
                <div className="relative flex items-center justify-center">
                  <Sun
                    className={cn(
                      "h-6 w-6 absolute text-yellow-500 transition-all duration-500 ease-in-out",
                      isdark
                        ? "rotate-90 scale-0 opacity-0"
                        : "rotate-0 scale-100 opacity-100"
                    )}
                  />
                  <Moon
                    className={cn(
                      "h-6 w-6 absolute text-blue-500 transition-all duration-500 ease-in-out",
                      isdark
                        ? "rotate-0 scale-100 opacity-100"
                        : "-rotate-90 scale-0 opacity-0"
                    )}
                  />
                </div>
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <Link to={logo.url} className="flex items-center gap-2">
                        <span className="text-lg font-bold">
                          <span className="text-green-400 dark:text-green-300 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]">
                            Digi
                          </span>
                          <span className="text-gray-800 dark:text-gray-200">
                            Praman
                          </span>
                        </span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 p-4">
                    <Accordion
                      type="single"
                      collapsible
                      className="flex w-full flex-col gap-4"
                    >
                      {menu.map((item) => renderMobileMenuItem(item))}
                    </Accordion>

                    <div className="flex flex-col gap-3">
                      <Button
                        variant="outline"
                        onClick={toggleTheme}
                        className="w-full justify-start text-lg"
                      >
                        {theme === "light" ? (
                          <Moon className="h-4 w-4 mr-2" />
                        ) : theme === "dark" ? (
                          <Sun className="h-4 w-4 mr-2" />
                        ) : (
                          <Sun className="h-4 w-4 mr-2" />
                        )}
                        Toggle theme
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-white transition-colors"
                      >
                        <Link to={auth.login.url}>{auth.login.title}</Link>
                      </Button>
                      <Button asChild>
                        <Link to={auth.signup.url}>{auth.signup.title}</Link>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger className="!text-lg hover:bg-muted/50 transition-colors">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {/* {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))} */}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <a 
        href={item.url}
        onClick={(e) => {
          e.preventDefault();
          const sectionId = item.url.substring(1);
          console.log("MenuItem clicked:", sectionId);
          // Direct call to scrollToSection to avoid scope issues
          setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
              console.log(`Found element with id ${sectionId} from menu item`);
              window.scrollTo({
                top: element.offsetTop - 80,
                behavior: 'smooth'
              });
            } else {
              console.error(`Element with id ${sectionId} not found from menu item`);
            }
          }, 100);
        }}
        className="hover:bg-muted/50 hover:text-accent-foreground group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 !text-lg font-medium transition-colors cursor-pointer"
      >
        {item.title}
      </a>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-lg py-0 font-semibold hover:no-underline hover:bg-muted/50 transition-colors rounded-md px-2">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a
      key={item.title}
      href={item.url}
      onClick={(e) => {
        e.preventDefault();
        const sectionId = item.url.substring(1);
        console.log("Mobile menu item clicked:", sectionId);
        
        // Direct scroll implementation for mobile menu
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            console.log(`Found element with id ${sectionId} from mobile menu`);
            window.scrollTo({
              top: element.offsetTop - 80,
              behavior: 'smooth'
            });
          } else {
            console.error(`Element with id ${sectionId} not found from mobile menu`);
          }
        }, 100);
      }}
      className="text-lg font-semibold hover:bg-muted/50 transition-colors rounded-md px-2 py-2 block cursor-pointer"
    >
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }) => {
  return (
    <Link
      className="hover:bg-muted hover:text-accent-foreground flex min-w-80 select-none flex-row gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors"
      to={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-muted-foreground text-sm leading-snug">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export { Navbar1 };
