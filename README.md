pdfDesign
=========
Orientado a realizar diseñar reportes de forma dinamica.
Instalacion:
============
composer require jkober/design
Nos preguntara
Please provide a version constraint for the jkober/design requirement: dev-master


luego agregar en:
"AppKernel.php"
            ,new Design\DesignBundle\DesignBundle()

para que funcione en principio tiene que tener una conexcion a base de datos definida.

para ir finalizando en routing.yml

DesignBundle:
    resource: "@DesignBundle/Resources/config/routing.yml"
    prefix:   /designer
    
Esto puede ser cualquier cosa    
      prefix:   /designer    
      prefix:   /pdf etc.          
