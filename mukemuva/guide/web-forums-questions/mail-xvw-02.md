
Bonjour XVW ! 

merci pour ta précédente réponse. En effet il s'agit bien de l'applicative Maybe et non de la monade dont j'ai grand besoin....

Je ne sais pas comment l'intégrer au code produit mais je regarde cela de près.

J'ai trouvé une solution pour représenter des relations N-aires sans utiilser de MAps de MAps. Le résultat escompté de de disposer d'une bases dee données en vif et en mémoire.

# pre-aloocated Block Memory Pool

Pour cela on a besoin de créer des blocs "duck" ou "canards" en français dans un poool de blocs préalloués. Je dispose actuellement d'un tel pool :

    const uid = pool.set_data(aribtrary_data)
    const data = pool.get_data(uid)

Attention ceci n'est pas une Map... ou plutôt pas directement ! En interne c'est un tablerau de blocs ayant chacun un UID sur 5 digits ç 37 positions (chiffees + lettres + underscore) générés de façon pseudo aléatoire.

# Duck Blocks

Coçin-coin-coin ! Donc un ensemble de blocks en mémoire;

    type Block = {
        uid: UID_37_pow_5
        ducktype: ROLE ( PART [ ITEM
        data: dependante_du_typeè_de_blocks
        related: [ array_of_uid ]
        countter:  0
    }







