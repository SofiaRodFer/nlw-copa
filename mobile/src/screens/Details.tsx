import React, { useState, useEffect } from 'react';
import { Share } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { HStack, useToast, VStack } from 'native-base';

import { api } from '../services/api';

import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { PoolProps } from '../components/PoolCard'
import { PoolHeader } from '../components/PoolHeader';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { Option } from '../components/Option';
import { Guesses } from '../components/Guesses';

interface RouteParams {
    id: string
}

export function Details() {
    const [isLoading, setIsLoading] = useState(true)
    const [poolDetails, setPoolDetails] = useState<PoolProps>({} as PoolProps)
    const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>('guesses')

    const route = useRoute()
    const { id } = route.params as RouteParams

    const toast = useToast()

    async function fetchPoolDetails() {
        try {
            setIsLoading(true)

            const response = await api.get(`/pools/${id}`)
            setPoolDetails(response.data.pool)

        } catch (error) {
            console.log(error)

            toast.show({
              title: 'Não foi possível carregar os detalhes do bolão',
              placement: 'top',
              bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false)
        }
    }

    async function handleCodeShare() {
        await Share.share({
            message: `Entre no meu bolão '${poolDetails.title}' com o código ${poolDetails.code}`
        })
    }

    useEffect(() => {
        fetchPoolDetails()
    }, [id])

    if (isLoading) {
        return (
            <Loading />
        )
    }

    return (
      <VStack flex={1} bgColor="gray.900">
        <Header 
            title={poolDetails.title} 
            showBackButton 
            showShareButton 
            onShare={handleCodeShare}
        />
        {
            poolDetails._count?.participants > 0 ?
            <VStack px={5} flex={1}>
                <PoolHeader data={poolDetails} />

                <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
                    <Option 
                        title="Seus palpites" 
                        isSelected={optionSelected === 'guesses'} 
                        onPress={() => setOptionSelected('guesses')}
                    />
                    <Option 
                        title="Ranking do Grupo" 
                        isSelected={optionSelected === 'ranking'} 
                        onPress={() => setOptionSelected('ranking')}
                    />

                    <Guesses poolId={poolDetails.id} code={poolDetails.code} />
                </HStack>
            </VStack>
            : <EmptyMyPoolList code={poolDetails.code} />
        }
      </VStack>
    );
}