import { lazy } from 'react'

export const ChangePasswordPage = lazy(() => import('@pages/change-password').then((module) => ({ default: module.ChangePasswordPage })))
export const DemoSectionPage = lazy(() => import('@pages/demo-section').then((module) => ({ default: module.DemoSectionPage })))
export const DiagnosisPage = lazy(() => import('@pages/diagnosis').then((module) => ({ default: module.DiagnosisPage })))
export const DiagnosisResultPage = lazy(() => import('@pages/diagnosis-result').then((module) => ({ default: module.DiagnosisResultPage })))
export const LoginPage = lazy(() => import('@pages/login').then((module) => ({ default: module.LoginPage })))
export const MainPage = lazy(() => import('@pages/main').then((module) => ({ default: module.MainPage })))
export const NotFoundPage = lazy(() => import('@pages/not-found').then((module) => ({ default: module.NotFoundPage })))
export const ProfilePage = lazy(() => import('@pages/profile').then((module) => ({ default: module.ProfilePage })))
export const ProfileEditPage = lazy(() => import('@pages/profile-edit').then((module) => ({ default: module.ProfileEditPage })))
export const SignUpPage = lazy(() => import('@pages/sign-up').then((module) => ({ default: module.SignUpPage })))
export const TravelSelectPage = lazy(() => import('@pages/travel-select').then((module) => ({ default: module.TravelSelectPage })))
