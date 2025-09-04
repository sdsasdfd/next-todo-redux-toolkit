"use client";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

enum PopularPlanType {
  NO = 0,
  YES = 1,
}

interface PricingProps {
  title: string;
  popular: PopularPlanType;
  price: number;
  description: string;
  buttonText: string;
  benefitList: string[];
  href: string;
  billing: string;
  paymentLink?: string;
}

const pricingList: PricingProps[] = [
  {
    title: "Premium",
    popular: 0,
    price: 49,
    description:
      "Lorem ipsum dolor sit, amet ipsum consectetur adipisicing elit.",
    buttonText: "Buy Now",
    benefitList: [
      "4 Team member",
      "4 GB Storage",
      "Upto 6 pages",
      "Priority support",
      "lorem ipsum dolor",
    ],
    href: "/api/auth/login",
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PLAN_LINK,
    billing: "/month",
  },
  {
    title: "Enterprise",
    popular: 1,
    price: 39,
    description:
      "Lorem ipsum dolor sit, amet ipsum consectetur adipisicing elit.",
    buttonText: "Buy Now",
    benefitList: [
      "10 Team member",
      "8 GB Storage",
      "Upto 10 pages",
      "Priority support",
      "lorem ipsum dolor",
    ],
    href: "/api/auth/login",
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_3_MONTHLY_PLAN_LINK,
    billing: "/3",
  },
  {
    title: "Enterprise",
    popular: 0,
    price: 29,
    description:
      "Lorem ipsum dolor sit, amet ipsum consectetur adipisicing elit.",
    buttonText: "Buy Now",
    benefitList: [
      "10 Team member",
      "8 GB Storage",
      "Upto 10 pages",
      "Priority support",
      "lorem ipsum dolor",
    ],
    href: "/api/auth/login",
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_6_MONTHLY_PLAN_LINK,
    billing: "/6",
  },
];

const Pricing = () => {
	const router = useRouter()
  // const handleCheckout = async(priceId: string)=>{
  // 	const res = await axios.post('/api/checkout', {priceId})

  // 	console.log('Response::', res.data)

  // }

  const handlePaymentLink = async(link: string)=> {
	localStorage.setItem("paymentLink", link)
	router.push('/auth/signup')
  }
  return (
    <section id="pricing" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Get
        <span className="bg-gradient-to-b from-[#667EEA] to-[#764BA2] uppercase text-transparent bg-clip-text">
          {" "}
          Unlimited{" "}
        </span>
        Access
      </h2>
      <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
        reiciendis.
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pricingList.map((pricing: PricingProps) => (
          <Card
            key={pricing.title}
            className={
              pricing.popular === PopularPlanType.YES
                ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10"
                : ""
            }
          >
            <CardHeader>
              <CardTitle className="flex item-center justify-between">
                {pricing.title}
                {pricing.popular === PopularPlanType.YES ? (
                  <Badge variant="secondary" className="text-sm text-primary">
                    Most popular
                  </Badge>
                ) : null}
              </CardTitle>
              <div>
                <span className="text-3xl font-bold">${pricing.price}</span>
                <span className="text-muted-foreground">
                  {" "}
                  {pricing.billing}
                </span>
              </div>

              <CardDescription>{pricing.description}</CardDescription>
            </CardHeader>

            <CardContent>
              {/* <Link href={pricing.paymentLink! || "#"}>
							<Button>
								Buy now
							</Button>
							</Link> */}
              <Button
                onClick={() => handlePaymentLink(pricing.paymentLink!)}
                className="bg-green-400 hover:bg-green-400"
              >
                Buy now
              </Button>
            </CardContent>

            <hr className="w-4/5 m-auto mb-4" />

            <CardFooter className="flex">
              <div className="space-y-4">
                {pricing.benefitList.map((benefit: string) => (
                  <span key={benefit} className="flex">
                    <Check className="text-purple-500" />{" "}
                    <h3 className="ml-2">{benefit}</h3>
                  </span>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
