"use client";

import {z} from zod
import {OctagonAlertIcon} from "lucide-react"
import {zodResolver} from "@hookform/resolvers/zod"

import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card";
import {Alert,AlertTitle} from "@/components/ui/alert"
import{
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form"



export const SignInView = () => {
  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hodden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form>Col 1</form>
          <div className="bg-radial from-blue-600 to-blue-700 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <img src="/logo.svg" alt="Image" className="h-[104px] w-[92px]" />
            <p className="text-2xl font-semibold text-white">Zap.AI</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
