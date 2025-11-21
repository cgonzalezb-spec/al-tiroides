import { Brain, Droplets, Activity, GitBranch, Zap, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ThyroidPhysiology = () => {
  return (
    <section id="fisiologia" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Fisiología de la Tiroides
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprende cómo funciona esta glándula a nivel hormonal y su regulación en el cuerpo
          </p>
        </div>

        {/* Anatomía de la tiroides */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
            Anatomía de la glándula tiroides
          </h3>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                La glándula tiroides es un órgano endocrino con forma de mariposa ubicado en la parte 
                anterior del cuello, justo por debajo del cartílago tiroides (manzana de Adán). Consta 
                de dos lóbulos laterales conectados por un istmo central.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Estructura microscópica:</strong> La tiroides está 
                compuesta por millones de folículos tiroideos, estructuras esféricas llenas de coloide 
                (una sustancia gelatinosa rica en tiroglobulina). Las células foliculares rodean estos 
                folículos y son responsables de sintetizar las hormonas tiroideas.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                También contiene células parafoliculares (células C) que producen calcitonina, una hormona 
                que regula los niveles de calcio en sangre.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">🦋</div>
                <p className="text-sm text-muted-foreground">
                  Glándula tiroides<br />
                  Peso: 15-20 gramos<br />
                  Dimensiones: 4-5 cm de largo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hormonas tiroideas */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
            Hormonas tiroideas principales
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Droplets className="h-8 w-8 text-blue-500" />
                </div>
                <CardTitle className="text-xl">T4 (Tiroxina)</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-left space-y-2">
                  <p><strong className="text-foreground">Composición:</strong> 4 átomos de yodo</p>
                  <p><strong className="text-foreground">Producción:</strong> 80% del total</p>
                  <p><strong className="text-foreground">Función:</strong> Forma de almacenamiento, se convierte en T3</p>
                  <p><strong className="text-foreground">Vida media:</strong> 7 días</p>
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle className="text-xl">T3 (Triyodotironina)</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-left space-y-2">
                  <p><strong className="text-foreground">Composición:</strong> 3 átomos de yodo</p>
                  <p><strong className="text-foreground">Producción:</strong> 20% directa, 80% por conversión</p>
                  <p><strong className="text-foreground">Función:</strong> Forma biológicamente activa</p>
                  <p><strong className="text-foreground">Vida media:</strong> 1 día</p>
                  <p className="text-primary"><strong>4-5 veces más potente que T4</strong></p>
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Activity className="h-8 w-8 text-purple-500" />
                </div>
                <CardTitle className="text-xl">Calcitonina</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-left space-y-2">
                  <p><strong className="text-foreground">Producción:</strong> Células C parafoliculares</p>
                  <p><strong className="text-foreground">Función:</strong> Regula el metabolismo del calcio</p>
                  <p><strong className="text-foreground">Acción:</strong> Reduce el calcio sanguíneo aumentando su depósito en huesos</p>
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Eje hipotálamo-hipófisis-tiroides */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
            Eje Hipotálamo-Hipófisis-Tiroides (HHT)
          </h3>
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8">
            <p className="text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
              La producción de hormonas tiroideas está regulada por un sistema de retroalimentación 
              negativa que involucra tres niveles del sistema endocrino:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Brain className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">1. Hipotálamo</CardTitle>
                      <p className="text-xs text-muted-foreground">Centro de control</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    Produce <strong className="text-foreground">TRH</strong> (Hormona Liberadora de Tirotropina) 
                    cuando detecta niveles bajos de hormonas tiroideas en sangre.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                      <GitBranch className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">2. Hipófisis</CardTitle>
                      <p className="text-xs text-muted-foreground">Glándula maestra</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    Responde a la TRH liberando <strong className="text-foreground">TSH</strong> (Hormona 
                    Estimulante de Tiroides) que viaja por la sangre hacia la tiroides.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <Droplets className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">3. Tiroides</CardTitle>
                      <p className="text-xs text-muted-foreground">Órgano efector</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    Estimulada por TSH, produce y libera <strong className="text-foreground">T3 y T4</strong> que 
                    regulan el metabolismo de todo el cuerpo.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center justify-center gap-4 flex-wrap mb-8">
              <div className="flex items-center gap-2">
                <span className="px-4 py-2 bg-primary/20 rounded-lg text-sm font-medium">Hipotálamo (TRH)</span>
                <ArrowRight className="h-5 w-5 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                <span className="px-4 py-2 bg-secondary/20 rounded-lg text-sm font-medium">Hipófisis (TSH)</span>
                <ArrowRight className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex items-center gap-2">
                <span className="px-4 py-2 bg-accent/20 rounded-lg text-sm font-medium">Tiroides (T3, T4)</span>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Retroalimentación Negativa
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cuando los niveles de T3 y T4 en sangre son suficientes, estas hormonas señalan al 
                hipotálamo y la hipófisis para que <strong className="text-foreground">reduzcan</strong> la 
                producción de TRH y TSH respectivamente. Este mecanismo mantiene los niveles hormonales 
                en equilibrio. Si los niveles de T3 y T4 bajan, el sistema se reactiva automáticamente.
              </p>
            </div>
          </div>
        </div>

        {/* Síntesis de hormonas tiroideas */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
            Síntesis de hormonas tiroideas
          </h3>
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Proceso paso a paso</CardTitle>
                <CardDescription>
                  La producción de T3 y T4 requiere yodo y sigue estos pasos:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      1
                    </div>
                    <div>
                      <strong className="text-foreground">Captación de yodo:</strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        Las células foliculares captan yoduro (I⁻) de la sangre mediante un transportador 
                        activo llamado simportador sodio-yoduro (NIS). El yodo es esencial para formar las hormonas.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      2
                    </div>
                    <div>
                      <strong className="text-foreground">Oxidación del yoduro:</strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        La enzima tiroperoxidasa (TPO) oxida el yoduro a yodo molecular, que es la forma reactiva.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      3
                    </div>
                    <div>
                      <strong className="text-foreground">Yodación de tirosinas:</strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        El yodo se une a residuos de tirosina en la molécula de tiroglobulina, formando 
                        monoyodotirosina (MIT) y diyodotirosina (DIT).
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      4
                    </div>
                    <div>
                      <strong className="text-foreground">Acoplamiento:</strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        MIT y DIT se combinan para formar T3 (MIT + DIT) y T4 (DIT + DIT). Estas hormonas 
                        permanecen unidas a la tiroglobulina dentro del coloide.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      5
                    </div>
                    <div>
                      <strong className="text-foreground">Secreción:</strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        Cuando TSH estimula la tiroides, la tiroglobulina es endocitada por las células 
                        foliculares, donde enzimas lisosomales liberan T3 y T4, que pasan a la circulación sanguínea.
                      </p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Conversión periférica */}
        <div className="bg-gradient-to-r from-blue-50/50 to-green-50/50 dark:from-blue-950/20 dark:to-green-950/20 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            Conversión periférica de T4 a T3
          </h3>
          <div className="max-w-3xl mx-auto">
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Aunque la tiroides produce principalmente T4, la mayor parte de la actividad hormonal proviene 
              de T3. La conversión de T4 a T3 ocurre principalmente en tejidos periféricos como:
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-card rounded-lg p-4 text-center">
                <p className="font-semibold text-foreground mb-1">Hígado</p>
                <p className="text-sm text-muted-foreground">Principal sitio de conversión</p>
              </div>
              <div className="bg-card rounded-lg p-4 text-center">
                <p className="font-semibold text-foreground mb-1">Riñones</p>
                <p className="text-sm text-muted-foreground">Conversión significativa</p>
              </div>
              <div className="bg-card rounded-lg p-4 text-center">
                <p className="font-semibold text-foreground mb-1">Músculo</p>
                <p className="text-sm text-muted-foreground">Uso local de hormonas</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Este proceso es catalizado por enzimas llamadas <strong className="text-foreground">desyodinasas</strong>, 
              que eliminan un átomo de yodo de T4 para formar T3. Aproximadamente el 80% de la T3 circulante 
              proviene de esta conversión periférica, no directamente de la tiroides.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThyroidPhysiology;
