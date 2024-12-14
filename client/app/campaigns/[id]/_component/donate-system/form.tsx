import { Dispatch, SetStateAction } from "react";
import { Address } from "viem";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ISupportedCoins } from "@/hooks/use-supported-coins";
import { useAccountCheck } from "@/hooks/use-account-check";

interface FormProps {
  title: string;
  description: string;
  inputValue: string;
  disabledBtn: boolean;
  handleInputChange(value: string): void;
  handleSubmit(): void;
  btnText: string;
  supportedCoins: ISupportedCoins;
  type?: "refund" | "donate";
  setToken: Dispatch<SetStateAction<Address>>;
  token: Address;
}

export default function Form({
  token,
  setToken,
  type = "refund",
  supportedCoins,
  ...props
}: FormProps) {
  const { isAccountAndCorrectNetwork } = useAccountCheck();
  const { supportedTokens, isFetching, error } = supportedCoins;
  const amountLabel = token
    ? supportedTokens[token as keyof typeof supportedTokens]?.name
    : "Select a token";

  return (
    <form
      className="flex flex-col space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();

        if (!token || !(await isAccountAndCorrectNetwork())) {
          return;
        }

        props.handleSubmit();
      }}
    >
      <p className="text-sm text-muted-foreground">{props.description}</p>
      <div>
        <Label htmlFor="token">Token</Label>
        <Select
          disabled={isFetching || Boolean(error)}
          value={token}
          onValueChange={async (token) => {
            setToken(token as Address);
          }}
        >
          <SelectTrigger className="w-full capitalize">
            <SelectValue placeholder="Select Token" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(supportedTokens).map(([token, detail]) => {
              return (
                <SelectItem key={token} value={token} className="capitalize">
                  {detail.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <Input
        type="number"
        placeholder={amountLabel}
        aria-label={amountLabel}
        disabled={!token}
        value={props.inputValue}
        onChange={(e) => props.handleInputChange(e.target.value)}
        className="w-full"
      />
      {type === "donate" && (
        <p className="text-sm text-primary font-semibold !mt-[0.1rem]">
          Minimum of $1 value of the selected token
        </p>
      )}
      <div className="flex">
        <Button type="submit" disabled={props.disabledBtn} className="w-full">
          {props.btnText}
        </Button>
      </div>
    </form>
  );
}
