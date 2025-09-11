import {TypingAnimation} from "./typingAnimation"

export function HeroDescription() {
  return (
    <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
      Revolutionary academic certificate verification using{" "}
      <span className="text-green-600 dark:text-green-400 font-semibold">
        <TypingAnimation text="blockchain technology" speed={60} delay={0.5}/>
      </span>
      {" "}and{" "}
      <span className="text-green-600 dark:text-green-400 font-semibold">
        <TypingAnimation text="AI-powered fraud detection" speed={60} delay={2.0} />
      </span>
      <TypingAnimation text=". Upload certificates for instant verification, tamper-proof storage, and secure authentication." speed={150} delay={3.0} />
    </p>
  );
}
