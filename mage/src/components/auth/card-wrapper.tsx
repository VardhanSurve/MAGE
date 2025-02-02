"use client"
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Header } from './header';
import Social from './social';
import { BackButton } from './back-button';

interface CardWrapperProps{
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean;
    AdminButtonHref?:string;
    AdminLabel?:string;
    className?: string; // Add className prop

}

export const CardWrapper = ({AdminLabel,AdminButtonHref,className,children,headerLabel,backButtonHref,backButtonLabel,showSocial}:CardWrapperProps) => {
  return (
    <Card className={`md:w-[400px]  dark:shadow-white/75 border-2 border-gray-500 h-max relative w-[320px] shadow-lg ${className}`}> {/* Apply className here */}
        <CardHeader>
            <Header label={headerLabel} />
        </CardHeader>
        <CardContent>
        {children}
        </CardContent>
        <CardFooter>
            <BackButton
                label={backButtonLabel}
                href={backButtonHref}
            />
                {AdminLabel && AdminButtonHref && ( // Conditionally render Admin button
                    <BackButton
                        label={AdminLabel}
                        href={AdminButtonHref}
                    />
                )}
        </CardFooter>
    </Card>
  )
}
