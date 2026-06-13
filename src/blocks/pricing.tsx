import { m } from "@/paraglide/messages.js";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Folder,
  Folders,
  Sparkles,
  Mail,
  Zap,
  Terminal,
  Check,
  Infinity as InfinityIcon,
  Headphones,
  Puzzle,
} from "lucide-react";

import { useRouter } from "@/core/i18n/navigation";
import { useSession } from "@/core/auth/client";
import { apiPost } from "@/lib/api-client";
import { usePublicConfig } from "@/hooks/use-public-config";
import {
  PricingTable,
  type PricingGroup,
  type PricingPlan,
} from "@/components/pricing-table";
import {
  PaymentProviderModal,
  type PaymentProvider,
} from "@/components/payment-provider-modal";

const ALL_PROVIDERS: PaymentProvider[] = [
  "stripe",
  "creem",
  "paypal",
  "alipay",
  "wechat",
];

export function Pricing({ title }: { title?: string } = {}) {
  const router = useRouter();
  const { data: session } = useSession();

  const { data: configsData } = usePublicConfig();
  const configs = configsData ?? {};
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<PricingPlan | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<PaymentProvider | null>(null);

  const enabledProviders = useMemo<PaymentProvider[]>(
    () => ALL_PROVIDERS.filter((p) => configs[`${p}_enabled`] === "true"),
    [configs],
  );

  const starterFeatures = [
    { icon: Folder, label: m["landing.pricing.feature_1_project"]() },
    { icon: Sparkles, label: m["landing.pricing.feature_5k_credits"]() },
    { icon: Mail, label: m["landing.pricing.feature_email_support"]() },
  ];
  const proFeatures = [
    { icon: Folders, label: m["landing.pricing.feature_unlimited_projects"]() },
    { icon: Sparkles, label: m["landing.pricing.feature_50k_credits"]() },
    { icon: Zap, label: m["landing.pricing.feature_priority_support"]() },
    { icon: Terminal, label: m["landing.pricing.feature_api_access"]() },
  ];
  const enterpriseFeatures = [
    { icon: Check, label: m["landing.pricing.feature_everything_pro"]() },
    { icon: InfinityIcon, label: m["landing.pricing.feature_unlimited_credits"]() },
    { icon: Headphones, label: m["landing.pricing.feature_dedicated_support"]() },
    { icon: Puzzle, label: m["landing.pricing.feature_custom_integrations"]() },
  ];

  const groups: PricingGroup[] = [
    {
      key: "passes",
      label: m["landing.pricing.monthly"](),
      plans: [
        {
          id: "worldcup-credit-pack",
          name: m["landing.pricing.starter"](),
          description: m["landing.pricing.starter_desc"](),
          price: "$1.99",
          features: starterFeatures,
          productId: "worldcup_credits_20",
          productName: "World Cup AI Credit Pack",
          priceInCents: 199,
          currency: "usd",
          credits: 20,
          creditsValidDays: 45,
        },
        {
          id: "worldcup-tournament-pass",
          name: m["landing.pricing.pro"](),
          description: m["landing.pricing.pro_desc"](),
          price: "$4.99",
          featured: true,
          badge: m["landing.pricing.popular"](),
          features: proFeatures,
          productId: "worldcup_tournament_pass",
          productName: "World Cup AI Tournament Pass",
          priceInCents: 499,
          currency: "usd",
          credits: 100,
          creditsValidDays: 45,
        },
        {
          id: "worldcup-sponsor-slot",
          name: m["landing.pricing.enterprise"](),
          description: m["landing.pricing.enterprise_desc"](),
          price: "$49",
          features: enterpriseFeatures,
          productId: "worldcup_sponsor_slot",
          productName: "World Cup Sponsor Slot",
          priceInCents: 4900,
          currency: "usd",
          credits: 0,
          creditsValidDays: 45,
          buttonText: m["common.pricing.get_started"](),
        },
      ],
    },
  ];

  const checkoutMutation = useMutation({
    mutationFn: ({
      plan,
      provider,
    }: {
      plan: PricingPlan;
      provider: PaymentProvider;
    }) =>
      apiPost<{ checkout_url?: string }>("/api/payment/checkout", {
        product_id: plan.productId,
        product_name: plan.productName || plan.name,
        plan_name: plan.plan?.name || plan.name,
        price: plan.priceInCents,
        currency: plan.currency || "usd",
        type: plan.plan ? "subscription" : "one-time",
        description: plan.name,
        plan: plan.plan,
        credits: plan.credits,
        credits_valid_days: plan.creditsValidDays,
        payment_provider: provider,
      }),
    onSuccess: (data) => {
      if (!data?.checkout_url) {
        toast.error("Checkout failed");
        setLoadingProvider(null);
        return;
      }
      window.location.href = data.checkout_url;
    },
    onError: (err: any) => {
      toast.error(err?.message || "Checkout failed");
      setLoadingProvider(null);
    },
  });

  function startCheckout(plan: PricingPlan, provider: PaymentProvider) {
    setLoadingProvider(provider);
    checkoutMutation.mutate({ plan, provider });
  }

  async function handleCheckout(plan: PricingPlan) {
    if (!session?.user) {
      const redirect = encodeURIComponent(
        typeof window !== "undefined" ? window.location.pathname : "/pricing",
      );
      router.push(`/sign-in?redirect=${redirect}`);
      return;
    }

    const selectEnabled = configs.select_payment_enabled === "true";
    const defaultProvider = (configs.default_payment_provider ||
      enabledProviders[0] ||
      "stripe") as PaymentProvider;

    if (selectEnabled && enabledProviders.length > 1) {
      setPendingPlan(plan);
      setModalOpen(true);
      return;
    }

    await startCheckout(plan, defaultProvider);
  }

  function handleProviderSelect(provider: PaymentProvider) {
    if (!pendingPlan) return;
    startCheckout(pendingPlan, provider);
  }

  return (
    <section id="pricing" className="border-t border-emerald-950/10 bg-[#edf4ed] px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-black tracking-tight text-emerald-950 sm:text-5xl">
            {title ?? m["landing.pricing.title"]()}
          </h2>
          <p className="mt-4 text-sm text-emerald-950/62">
            {m["landing.pricing.description"]()}
          </p>
        </div>
        <PricingTable groups={groups} onCheckout={handleCheckout} />
      </div>

      <PaymentProviderModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) {
            setPendingPlan(null);
            setLoadingProvider(null);
          }
        }}
        providers={enabledProviders.length ? enabledProviders : ["stripe"]}
        loadingProvider={loadingProvider}
        onSelect={handleProviderSelect}
        planName={pendingPlan?.name}
        price={pendingPlan?.price}
      />
    </section>
  );
}
